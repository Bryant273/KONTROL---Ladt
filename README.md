# 🏢 UNIKORP ERP — Manuel de Spécifications & d'Architecture Distribution

UNIKORP est une suite progicielle intégrée (ERP - *Enterprise Resource Planning*) de nouvelle génération, conçue pour répondre aux réalités d'exploitation et aux exigences réglementaires de la zone UEMOA / CEMAC (OHADA révisé).

Ce document détaille :
1. La **Logique ERP Fondatoriale** et l'importance cruciale du **Fichier de Gestion / Dossier (.ukp)** comme point d'ancrage universel.
2. La cartographie complète de l'application et de ses modules, avec un focus intensif sur le cœur comptable **SKOMPTAB**.
3. La spécification d'une **réécriture d'architecture simplifiée** et robuste unissant **Angular**, **Go**, **Java**, et **Rust**, appuyée par un système de persistance hybride **PostgreSQL + NoSQL**.

---

## 🔑 1. La Logique Fondatoriale de l'ERP : Le Fichier de Gestion Primordial

Dans la logique d’UNIKORP, **aucun module secondaire ne peut fonctionner dans le vide**. La suite gravite autour de l'existence d'un dossier actif ou **Fichier de Gestion d'Exercice (porté par le format d'échange .ukp)**.

### Le Rôle Central du Dossier (.ukp)
Lorsqu'une entreprise s'enregistre ou démarre sa journée d'exploitation, elle doit initialiser ou charger un **Dossier de Gestion d'Exercice**. Ce fichier consolide :
- Les paramètres d'identité légale (Raison sociale, Sigle, N° Fiscal NCC, N° CNPS, Régime d'imposition).
- Le cadre comptable juridique (Zone économique, pays résident, devise de référence, plan comptable cible).
- La structure physique des données (Longueur des comptes généraux, longueur des comptes tiers, longueur des sections analytiques).
- Le bilan et la balance d'ouverture (Bilan d'ouverture équilibré Débit / Crédit).

### Une dépendance fonctionnelle multiniveaux
Les autres modules de l'ERP se greffent directement sur les comptes ouverts dans ce dossier maître :
1. **SOCIX (RH & Paie)** : Chaque bulletin de salaire généré doit être traduit en écritures comptables (Salaires bruts, charges patronales, retenues). SOCIX requiert la présence des comptes de la classe 4 (Personnel) et 6 (Charges de personnel) actifs dans le fichier de gestion pour pouvoir valider et valider une paie.
2. **LOGSON (Stocks & Flotte)** : Les réceptions de stocks modifient les valeurs physiques. Elles se traduisent directement par des écritures de classe 3 (Stocks) et classe 6 (Achats) répercutées dans le dossier de gestion en cours.
3. **MARKOS (CRM & Facturation)** : Le closing d'un contrat ou l'émission d'une facture de vente génère une ligne de créance client (Compte 411) et de produit (Compte 70). Sans le fichier de gestion actif pour valider l'existence du client tiers et inscrire l'écriture correspondante, aucune facturation n'est autorisée.

---

## 📈 2. Description Fonctionnelle Exhaustive : Le Module SKOMPTAB

Le module **SKOMPTAB** est le cœur décisionnel et fiduciaire de l'écosystème UNIKORP. Il a été conçu pour gérer rigoureusement l'ensemble des opérations comptables générales et analytiques de l'entreprise.

### A. Initialisation & Onboarding d'un Dossier de Gestion
La création d'un exercice fiscal suit un parcours de configuration strict en 5 étapes clés (INFO, CONFIG, BALANCE, PERIOD, RECAP) simulant le déploiement d'un nouveau fichier de gestion :
1. **Identité d'Entreprise (INFO)** : Collecte des marques légales pour les déclarations d'impôts (NCC, CNPS, RCCM, Forme Juridique telle que SARL ou SAS, adresse du siège). Un logo est importé puis converti sous forme d'URI pour l'encapsuler de manière autonome dans le fichier unifié.
2. **Paramètres Système (CONFIG)** : Choix de la taille de masquage des comptes généraux, tiers (fournisseurs/clients) et analytiques (ex: de 4 à 12 caractères). Définition de la devise (FCFA par défaut pour l'UEMOA/CEMAC) et du plan comptable (Standard SYSCOHADA Révisé ou modèle importé).
3. **Solde Initial / Balance d'Ouverture (BALANCE)** :
   - *Nouveau départ* : Démarrage avec des soldes vierges (pour les nouvelles créations).
   - *Saisie Manuelle* : Équilibrage forcé de l'Actif (Comptes d'immobilisations 2x, stocks 3x, banques 52, caisse 57) et du Passif (Capital 10, réserves 11, emprunts 16, dettes 40). Le système impose une validation arithmétique stricte : `Somme(Actif) - Somme(Passif) === 0`.
   - *Importation Intelligente* : Lecture et parsing instantané de balances au format Excel, CSV ou du fichier natif `.ukp`, répartissant automatiquement les soldes.
4. **Dates d'Exercice (PERIOD)** : Configuration de l'année fiscale de référence et des dates de début/fin (limitées à une durée légale maximale de 18 mois pour des exercices spéciaux de création).
5. **Recouvrement & Synthèse (RECAP)** : Signature numérique de conformité et génération de l'écriture de report à nouveau (bilan d'ouverture).

### B. Le Saisie Multi-Journaux & Saisie d'Écritures de Brouillard
Le module SKOMPTAB possède une interface de saisie à double entrée ergonomique et hautement contrôlée :
- **Les Journaux Comptables** : Séparation des écritures selon la nature des flux :
  - `ACH` (Journal des Achats) pour les tiers fournisseurs.
  - `VEN` (Journal des Ventes) pour la facturation des clients.
  - `BNK` (Journal de Banque) pour les opérations financières bancaires.
  - `CAI` (Journal de Caisse) pour les flux d'espèces physiques.
  - `OD` (Journal des Opérations Diverses) pour les écritures correctives, de paie ou amortissements.
  - `RAN` (Journal de Report à Nouveau) pour le bilan d'ouverture.
- **La saisie en Brouillard (Transitoire)** : Pour assurer la sécurité et l'exactitude des écritures, SKOMPTAB introduit le concept de "Brouillard". Une écriture saisie par un collaborateur n'est pas modifiée au Journal Général de manière indélébile. Elle reste modifiable ou supprimable dans le registre transitoire du brouillard.
- **Validation Globale & Clôture** : Une fois visées et validées par le Directeur Comptable de l'entreprise, les écritures du brouillard subissent une validation ultime, bloquant l'écriture en écriture comptable définitive au sein du Grand Livre général.

### C. Moteur d'Analyse et Visualisation de Flux Comptables
Une fois les écritures stockées et ventilées, SKOMPTAB génère dynamiquement les rapports légaux indispensables pour l'administration fiscale et les réunions de gouvernance :
1. **Le Brouillard et Journal Chronologique** : Liste exhaustive des flux ordonnés par date d'effet.
2. **Le Grand Livre Général** : Regroupement méthodique des écritures par comptes comptables, permettant d'étudier l'historique d'un poste de dépense ou de recette spécifique.
3. **Le Grand Livre Auxiliaire** : Vue consolidée par comptes tiers (fournisseurs et clients individuels) facilitant les opérations de lettrage.
4. **La Balance Générale multi-colonnes** : Présentation globale des mouvements débiteurs et créditeurs d'une période donnée, ainsi que les soldes débiteurs/créditeurs finaux. Elle permet de certifier l’exactitude de l’exercice à tout instant.
5. **Tableaux de bords et visualisations interactives** : Exploitation graphique des flux budgétaires pour offrir aux dirigeants d'Abidjan un tableau de bord prévisionnel (ratios de liquidité, niveau de cash flow, résultat net net provisoire).

---

## 🛠️ 3. Architecture Réécrite Simplifiée (Angular + Go + Java + Rust)

Afin d'optimiser l'ERP pour la production industrielle en garantissant une scalabilité linéaire et un cycle de développement clair, l'architecture a été simplifiée selon une répartition spécialisée des services.

### A. Principes de la Répartition Technologique

```
   [ Navigateur Utilisateur ] <------------------------+
              |                                        | (Flux Temps Réel - SSE)
              v (Requêtes HTTP/gRPC-Web)               |
    +--------------------------------------+           |
    |  Go API Gateway & Notifier (8080)   |-----------+
    +--------------------------------------+
         | (gRPC)                     | (gRPC)
         v                            v
    +-------------------+    +----------------------+
    |   Rust Security   |    |  Java Business Core  |
    |   Worker (50051)  |    |  (All Modules - 8081)|
    +-------------------+    +----------------------+
                                      |
                       +--------------+--------------+
                       |                             |
                       v (SQL)                       v (NoSQL JSON/cache)
               +---------------+             +---------------+
               |  PostgreSQL   |             |  Redis cache  |
               +---------------+             +---------------+
```

1. **Angular 18+** : Interface utilisateur unique (Single-Page Application), uniforme et fortement typée en TypeScript. Elle offre une manipulation fluide des structures tabulaires de transactions et s'abonne aux notifications temps-réel via serveurs WebSockets ou SSE.
2. **Go (Golang)** : L'API Gateway centrale. Il est l'unique point d'entrée réseau, chargé d'aiguiller le trafic, de gérer la limitation de débit (rate-limiting) et de manager les connexions de notifications asynchrones en arrière-plan.
3. **Rust** : Le gardien de la sécurité, de la cryptographie et de la politique d'accès. Il gère la création des tokens JWT (chiffrement asymétrique), la validation interne rapide des signatures, le décryptage et encodage des fichiers `.ukp` hautement confidentiels.
4. **Java 21 / Spring Boot 3** : L'unique moteur de règles métiers. Il concentre TOUTE la logique des modules (SKOMPTAB, SOCIX, LOGSON, MARKOS). Cela simplifie grandement la maintenance en évitant de dupliquer les concepts d'entreprise (salaires, comptabilité, stocks) dans plusieurs langages.
5. **PostgreSQL** : La persistance centrale des données structurelles et de comptabilité générale par le biais d'un modèle relationnel transactionnel solide et multi-tenant.
6. **NoSQL (Redis / MongoDB)** : Une base NoSQL dédiée au cache d'états rapides (soldes calculés) et au stockage des fichiers `.ukp` brouillons transitoires non encore intégrés en base de données SQL.

---

## 💻 4. Spécifications Techniques & Exemples de Code Cibles

### 🅰️ A. Le Frontend : Angular 18+ — Portail ERP Unifié
Angular assure une réactivité totale de l'arbre comptable et des grilles de balance grâce à son nouveau moteur réactif de **Signals** et au chargement intelligent (*Lazy Loading*).

#### Composant Principal d'Onboarding : `dossier-setup.component.ts`
```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dossier-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center p-6">
      <div class="max-w-xl w-full mx-auto bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl space-y-6">
        <div class="space-y-2">
          <p class="text-[9px] font-black uppercase text-indigo-500 tracking-widest italic">UNIKORP Setup</p>
          <h2 class="text-3xl font-black text-slate-900 tracking-tight uppercase">Initialiser votre Entreprise</h2>
        </div>

        <form [formGroup]="setupForm" (ngSubmit)="onFormSubmit()" class="space-y-4">
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Raison Sociale</label>
            <input type="text" formControlName="name" class="w-full h-11 border border-slate-200 rounded-xl px-4 text-xs font-bold" placeholder="EX: UNIKORP CÔTE D'IVOIRE" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Sigle Unique</label>
              <input type="text" formControlName="acronym" class="w-full h-11 border border-slate-200 rounded-xl px-4 text-xs font-black text-indigo-500 tracking-wider" placeholder="EX: UNK-CI" />
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Devise de Tenue</label>
              <select formControlName="currency" class="w-full h-11 border border-slate-200 rounded-xl px-4 text-xs font-bold">
                <option value="FCFA">FCFA (Afrique de l'Ouest)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar (USD)</option>
              </select>
            </div>
          </div>

          <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <span class="text-[10px] font-black uppercase text-indigo-600 tracking-wide">Référentiel Cible</span>
            <span class="text-xs font-bold text-slate-700">SYSCOHADA Révisé</span>
          </div>

          <button type="submit" [disabled]="!setupForm.valid" class="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 transition-opacity">
            Créer le Fichier .UKP d'Exercice
          </button>
        </form>
      </div>
    </div>
  `
})
export class DossierSetupComponent {
  private fb = inject(FormBuilder);

  setupForm = this.fb.group({
    name: ['', Validators.required],
    acronym: ['', [Validators.required, Validators.maxLength(10)]],
    currency: ['FCFA', Validators.required]
  });

  onFormSubmit() {
    if (this.setupForm.valid) {
      console.log('Envoi des données à la Gateway Go pour validation et provisionnement:', this.setupForm.value);
    }
  }
}
```

---

### 🐹 B. API Gateway & Concurence : Go (Golang) — Le Point d'Entrée
Focalisé sur la performance d'E/S réseau brute. Go gère le reverse proxy vers Java et sert de diffuseur d'événements comptables temps réels.

```go
package main

import (
	"context"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type GatewayProxy struct {
	javaServiceURL *url.URL
}

func NewGatewayProxy(javaAddr string) *GatewayProxy {
	target, err := url.Parse(javaAddr)
	if err != nil {
		log.Fatalf("URL du service Java invalide : %v", err)
	}
	return &GatewayProxy{javaServiceURL: target}
}

// Middleware d'autorisation rapide passant par le microservice de vérification Rust
func (gp *GatewayProxy) AuthsCheckMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" || !strings.HasPrefix(token, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authentification requise"})
			return
		}
		
		// Ici, l'API Gateway effectue un appel gRPC rapide à l'agent de sécurité Rust (Port 50051)
		// Simulé ici pour l'économie du code :
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
		defer cancel()
		_ = ctx // Utilisation du contexte pour l'appel distant

		log.Println("[Go Gateway] Token transmis au valideur Rust avec succès.")
		c.Next()
	}
}

func (gp *GatewayProxy) ReverseProxy() gin.HandlerFunc {
	proxy := httputil.NewSingleHostReverseProxy(gp.javaServiceURL)
	return func(c *gin.Context) {
		log.Printf("[Go Gateway] Redirection de la requête métier d'entreprise vers le démon Java Spring : %s", c.Request.URL.Path)
		proxy.ServeHTTP(c.Writer, c.Request)
	}
}

func main() {
	r := gin.Default()
	proxy := NewGatewayProxy("http://localhost:8081")

	// Routes publiques (Authentification gérée par le validateur Rust ultérieurement)
	r.POST("/api/auth/login", func(c *gin.Context) {
		// Demande de jeton déléguée au service Rust
		log.Println("[Go Gateway] Délégation de génération de jeton asymétrique à Rust.")
		c.JSON(200, gin.H{"access_token": "rt_secure_jwt_token_sample"})
	})

	// Routes d'administration et de gestion ERP (Sous authentification rapide)
	secured := r.Group("/api/v1")
	secured.Use(proxy.AuthsCheckMiddleware())
	{
		// Tout le reste est envoyé vers le moteur métier Spring Boot
		secured.Any("/*any", proxy.ReverseProxy())
	}

	log.Println("[Go Gateway ERP] Serveur API Gateway configuré sur le port :8080")
	r.Run(":8080")
}
```

---

### ☕ C. Cœur Métier Progiciel (All Modules) : Java 21 / Spring Boot 3
Java coordonne l'ensemble des structures de données de l'entreprise. En réunissant SKOMPTAB, SOCIX, LOGSON et MARKOS au sein d'un même projet Spring standardisé, on résout les obstacles de double comptabilisation.

#### Contrôleur de validation d'Écriture Générale : `SkomptabJournalController.java`
```java
package com.unikorp.skomptab.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/skomptab")
public class SkomptabJournalController {

    public record JournalLineDto(String accountNumber, String label, BigDecimal debit, BigDecimal credit) {}
    public record LedgerEntryDto(LocalDate date, String reference, String description, List<JournalLineDto> lines) {}

    /**
     * Reçoit les propositions de transactions des modules (RH, Stocks, Ventes)
     * et valide la règle arithmétique fondamentale de la partie double comptable.
     */
    @PostMapping("/dossier/{dossierID}/entry")
    public ResponseEntity<?> registerLedgerEntry(
            @PathVariable("dossierID") String dossierID,
            @RequestBody LedgerEntryDto entryDto) {

        if (entryDto.lines() == null || entryDto.lines().isEmpty()) {
            return ResponseEntity.badRequest().body("L'écriture doit posséder au moins une écriture de débit et de crédit.");
        }

        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        for (JournalLineDto line : entryDto.lines()) {
            if (line.debit().compareTo(BigDecimal.ZERO) < 0 || line.credit().compareTo(BigDecimal.ZERO) < 0) {
                return ResponseEntity.badRequest().body("Les montants saisis ne peuvent pas être négatifs.");
            }
            totalDebit = totalDebit.add(line.debit());
            totalCredit = totalCredit.add(line.credit());
        }

        // Vérification de l'adéquation arithmétique Débit = Crédit
        if (totalDebit.compareTo(totalCredit) != 0) {
            BigDecimal diff = totalDebit.subtract(totalCredit).abs();
            return ResponseEntity.badRequest().body(
                String.format("Déséquilibre comptable détecté. Différence constatée de : %s FCFA", diff.toString())
            );
        }

        // Sauvegarde de l'écriture qualifiée en Brouillard d'Exercice (PostgreSQL)
        // ... Logique ORM d'insertion JPA ...

        return ResponseEntity.ok().body("Écriture validée et enregistrée en brouillard de gestion dans le dossier " + dossierID);
    }
}
```

---

### Cr⚙️ D. Sécurité, Chiffrement & Token Agent : Rust 1.80+
Rust gère l'évaluation de jetons JWT sécurisés et le chiffrement hermétique des documents d'exercice `.ukp` de l'entreprise.

```rust
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use serde::{Serialize, Deserialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,          // ID de l'utilisateur (UID)
    pub ent_id: String,       // ID de l'entreprise connectée
    pub role: String,         // Rôle de sécurité (Admin, Comptroller, Accountant)
    pub exp: usize,           // Date d'expiration en secondes
}

pub struct SecurityManager {
    secret: Vec<u8>,
}

impl SecurityManager {
    pub fn new(secret_key: &str) -> Self {
        SecurityManager {
            secret: secret_key.as_bytes().to_vec(),
        }
    }

    /// Génère un jeton sécurisé pour un utilisateur d'une entreprise
    pub fn mint_token(&self, user_id: &str, enterprise_id: &str, role: &str) -> Result<String, String> {
        let expiration = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|_| "Erreur temporelle")?
            .as_secs() + 14400; // Durée fixe de 4 heures d'exploitation autorisée

        let claims = Claims {
            sub: user_id.to_string(),
            ent_id: enterprise_id.to_string(),
            role: role.to_string(),
            exp: expiration as usize,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(&self.secret)
        ).map_err(|err| format!("Échec de chiffrement JWT: {:?}", err))
    }

    /// Filtre et valide si le token transité par l'API Gateway Go est authentique
    pub fn verify_token(&self, token: &str) -> Result<Claims, String> {
        let mut val = Validation::new(Algorithm::HS256);
        val.leeway = 10; // Dérive acceptable de 10 secondes

        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(&self.secret),
            &val
        ).map_err(|err| format!("Signature invalide: {:?}", err))?;

        Ok(token_data.claims)
    }
}
```

---

## 🗄️ 5. Choix de la Base de Données & Stockage Hybride (Relational + NoSQL)

Pour assurer une gestion efficace de l'activité financière et administrative sans dégrader la réactivité de la plateforme, l'architecture cible se dote d'un système à deux niveaux de persistance :

### A. Le Cœur Cohérent : PostgreSQL
Les tables de comptabilité générale nécessitent le respect absolu des propriétés **ACID** (Atomicité, Cohérence, Isolation, Durabilité) pour empêcher la dénaturation de l’équilibre comptable des entreprises.
- **Modèle de Données Partitionné** : Les données sont partitionnées (*Sharded*) par Enterprise ID (`enterprise_id`) au sein d'une base consolidée pour garantir qu’une entreprise ne puisse jamais lire ou corrompre les écritures d’une entité concurrente.
- **Tables Principales** :
  - `enterprises` (NCC, CNPS, logo, informations légales)
  - `dossiers` (Exercice fiscal, états, configuration des longueurs de comptes)
  - `accounts` (Plan comptable général SYSCOHADA et comptes tiers)
  - `ledger_entries` (Date, numéro de pièce, libellé général)
  - `journal_lines` (ID écriture, compte, libellé ligne, débit, crédit)

### B. Le Cache Réactif et Registre Volatile : Redis + MongoDB
Le NoSQL intervient en soutien du SQL pour absorber les débits d'écriture transitoires et accélérer les requêtes d'affichage :
- **Redis (Cache & Sessions)** : Stocke les sessions utilisateurs valides décryptées par Rust, ainsi que les soldes courants cumulés des comptes de l'entreprise. Lorsqu'un utilisateur d'Angular modifie un onglet de balance, le calcul est répercuté instantanément à l'écran en lisant la structure d'index Redis précalculée plutôt que d'exécuter une requête SQL d'agrégation `SUM` sur des millions de lignes de journaux.
- **MongoDB / Stockage JSON (Brouillard alternatif & Fichiers .UKP)** : Utilisé pour conserver l'état brut de sauvegarde des fichiers de dossiers `.ukp` en tant qu'archives non structurées de secours, et à archiver les copies complètes de factures numérisées issues du module de capture au format JSON.

---

## 🚀 6. Avantages Stratégiques de cette Simplification

Cette architecture simplifiée résout nativement les problèmes d'évolutivité et réduit la charge cognitive de maintenance du projet :
1. **Unicité des rênes métiers** : En localisant l'intégralité des calculs métiers complexes dans le conteneur **Java**, nous évitons les écarts d'arrondis monétaires ou les distorsions de règles fiscales qui surviennent lorsque les calculs de taxes sont répartis ou dupliqués entre plusieurs langages.
2. **Couplage lâche et rapidité** : La Gateway **Go** n'effectue aucun calcul métier. Elle reçoit, valide le format, interroge rapidement le validateur de token **Rust** pour s'assurer de l'authenticité de l'émetteur, et délègue au thread pool **Java** les tâches transactionnelles complexes.
3. **Sécurité maximale isolée** : L'algorithme de hachage et la cryptographie du format propriétaire `.ukp` relèvent exclusivement du code natif certifié de **Rust**, évitant les vulnérabilités courantes de fuite mémoire.
4. **Onboarding instantané** : La centralisation relationnelle dans **PostgreSQL** permet d'assurer une étanchéité multi-tenant parfaite, garantissant la sécurité légale de chaque fichier de gestion d'exercice d'Abidjan.
